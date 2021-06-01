import { Table, Model, DataType, Column } from 'sequelize-typescript';

@Table
export class Movie extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: { name: 'title', msg: 'colliding-title' },
  })
  title: string;

  @Column({ type: DataType.DATE })
  released: Date;

  @Column({ type: DataType.STRING })
  genre: string;

  @Column({ type: DataType.STRING })
  director: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;
}
