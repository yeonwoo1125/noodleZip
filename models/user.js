const Sequelize = require('sequelize');

class User extends Sequelize.Model {

    static init(sequelize) {

        return super.init(
            {
                userId : {
                    primaryKey : true,
                    type : Sequelize.STRING(20)
                },
                userName : {
                    type : Sequelize.STRING(20),
                    allowNull :false
                },
                userPassword : {
                    type : Sequelize.STRING(60),
                    allowNull : false
                }
            },
            {
                sequelize,
                timestamps:false,
                tableName : 'user_tb',
                modelName : 'User',
                charset : 'utf8',
                collate : 'utf8_general_ci',
            }
        );
    }

    static associate(db) {
        db.User.hasMany(db.Memo, {foreignKey : 'userId', sourceKey : 'userId'});
    }
}

module.exports = User;