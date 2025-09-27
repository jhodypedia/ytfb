import { Sequelize } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "../../data.sqlite"),
  logging: false
});

// For MySQL, swap to:
// const sequelize = new Sequelize('dbname','user','pass',{host:'localhost', dialect:'mysql', logging:false});

export default sequelize;
