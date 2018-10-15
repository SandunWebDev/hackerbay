module.exports = (sequelize, DataTypes) =>
  sequelize.define("website", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
        deferrable: sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      validate: {
        isUrl: true,
        notEmpty: true
      }
    },
    onlineStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  });
