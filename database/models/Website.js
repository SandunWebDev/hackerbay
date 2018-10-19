module.exports = (sequelize, DataTypes) =>
  sequelize.define("website", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    websiteName: {
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
      defaultValue: true,
      validate: {
        notEmpty: true
      }
    }
  });
