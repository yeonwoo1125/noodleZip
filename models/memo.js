const Sequelize = require('sequelize');

class Memo extends Sequelize.Model {

    static init(sequelize) {

        return super.init(
            {
                memoId : {
                    primaryKey : true,
                    autoIncrement :true,
                    type : Sequelize.INTEGER
                },
                memoTitle : {
                    type : Sequelize.STRING(30),
                    allowNull :false
                },
                memoContent : {
                    type : Sequelize.STRING(100),
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
        db.Memo.belongsTo(db.User, {foreignKey : 'userId', targetKey : 'userId'});
    }
}

module.exports = Memo;