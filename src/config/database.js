module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'your database username here',
  password: 'your database password here',
  database: 'meetapp',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
