module.exports = {
  development: {
    use_env_variable: "DATABASE_URL"
  },
  test: {
    use_env_variable: "DATABASE_URL",
    dialectOptions: {
      ssl: {
        require: false,
        rejectUnauthorized: false
      }
    }
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialectOptions: {
      ssl: {
        require: false,
        rejectUnauthorized: false
      }
    }
  }
}
