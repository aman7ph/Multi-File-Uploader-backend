import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import Category from "./category";

class FileMetadata extends Model {
  public id!: number;
  public description!: string;
  public filetype!: string;
  public filename!: string;
  public file!: string;
  public categoryId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly category?: Category;

  static associate() {
    FileMetadata.belongsTo(Category, {
      foreignKey: "categoryId",
      onDelete: "CASCADE",
    });
  }
}

FileMetadata.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filetype: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "FileMetadata",
  }
);

FileMetadata.sync({ force: false }).then(() => {
  FileMetadata.associate();
});

export default FileMetadata;
