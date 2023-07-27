const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
 'rojreDB',
 'postgres',
 '123456$',
  {
    host: 'localhost',
    dialect: 'postgres'
  }
);

sequelize.authenticate().then(() => {
   console.log('Connection has been established successfully.');
}).catch((error) => {
   console.error('Unable to connect to the database: ', error);
});


const Book = sequelize.define("books", {
   title: {
     type: DataTypes.STRING,
     allowNull: false
   },
   author: {
     type: DataTypes.STRING,
     allowNull: false
   },
   release_date: {
     type: DataTypes.DATEONLY,
   },
   subject: {
     type: DataTypes.INTEGER,
   }
});

sequelize.sync().then(() => {
   console.log('Book table created successfully!');
   Book.create({
       title: "Clean Code",
       author: "Robert Cecil Martin",
       release_date: "2021-12-14",
       subject: 3
   }).then(res => {
       console.log(res)
   }).catch((error) => {
       console.error('Failed to create a new record : ', error);
   });
}).catch((error) => {
   console.error('Unable to create table : ', error);
});
