module.exports = (sequelize, DataTypes) =>
  sequelize.define("user", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    // This Field contain E.164 Internation Phone Numbers
    phoneNum: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        // Theres no simple way to validate E.164 Internation Phone Numbers. So It's good to do Twillo lookup API call to make sure number is validated.
        is: /^\+?[1-9]\d{1,14}$/
      }
    }
  });
