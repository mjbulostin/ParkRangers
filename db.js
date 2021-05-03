const { Sequelize, DataTypes, Model } = require("sequelize");

// initialize our connection
const sequelize = new Sequelize(
  "postgresql://brock:testing@localhost:5432/brock"
);

// define the Doctor model
const Doctor = sequelize.define(
  "Doctor",
  {
    email: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "doctors",
    timestamps: false,
  }
);

// define the Patient model
const Patient = sequelize.define(
  "Patient",
  {
    id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "patients",
    timestamps: false,
  }
);

// define the Appointment model
const Appointment = sequelize.define(
  "Apointment",
  {
    id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    apptDate: {
      allowNull: false,
      field: "appt_date",
      type: DataTypes.DATE,
    },
    DoctorId: {
      allowNull: false,
      field: "doctor_id",
      type: DataTypes.INTEGER,
    },
    PatientId: {
      allowNull: false,
      field: "patient_id",
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "appointments",
    timestamps: false,
  }
);

// define associations
Appointment.belongsTo(Doctor, { foreignKey: "doctor_id" });
Appointment.belongsTo(Patient, { foreignKey: "patient_id" });
Doctor.hasMany(Appointment, { foreignKey: "doctor_id" });
Patient.hasMany(Appointment, { foreignKey: "doctor_id" });
Doctor.belongsToMany(Patient, { through: Appointment });
Patient.belongsToMany(Doctor, { through: Appointment });

const models = {
  Appointment,
  Doctor,
  Patient,
};

module.exports = models;
