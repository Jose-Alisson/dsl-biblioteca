

let isBuild = process.env['IsBUILD'] ?? false

//export const DSL_API_URL = "https://dsl-biblioteca-api.up.railway.app/api"
export const DSL_API_URL = isBuild ? "https://dsl-biblioteca-api.up.railway.app/api" : "http://localhost:8080/api"
