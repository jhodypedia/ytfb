import sequelize from "../config/db.js";
import UserDef from "./user.js";
import JobDef from "./job.js";
import SettingDef from "./setting.js";

const User = UserDef(sequelize);
const Job = JobDef(sequelize);
const Setting = SettingDef(sequelize);

Job.belongsTo(User, { foreignKey: "userId" });

export default { sequelize, User, Job, Setting };
