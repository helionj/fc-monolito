import { Column,  HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import OrderProductModel from "./order-product.model";

@Table({
  tableName: "orders",
  timestamps: false,
})
export default class OrderModel extends Model {

  @PrimaryKey
  @Column({allowNull: false})
  id: string;

  @HasMany(() => OrderProductModel)
  declare products: OrderProductModel[];

  @Column({allowNull: false})
  status: string;

  @Column({allowNull: false})
  client_id: string;

  @Column({allowNull: false})
  client_name: string;

  @Column({allowNull: false})
  client_email: string;

  @Column({allowNull: false})
  client_address: string;

  @Column({allowNull: false})
  createdAt: Date;

  @Column({allowNull: false})
  updatedAt: Date;

  
}