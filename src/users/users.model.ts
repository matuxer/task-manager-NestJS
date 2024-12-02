import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Task } from 'src/tasks/tasks.model';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: [3, 50],
    },
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @HasMany(() => Task, { onDelete: 'CASCADE' })
  tasks: Task[];

  toJSON() {
    const values = { ...this.get() };
    delete values.password;
    return values;
  }
}
