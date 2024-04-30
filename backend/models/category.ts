import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import FileMetadata from "./fileMetadata"; // Import FileMetadata model

class Category extends Model {
  public id!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate() {
    Category.hasMany(FileMetadata, {
      foreignKey: "categoryId",
      onDelete: "CASCADE",
      hooks: true,
    });
  }
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Category",
  }
);

Category.sync({ force: false }).then(() => {
  Category.associate();
});

export default Category;
