import { GenerateServiceProps } from '@umijs/openapi'

export default {
    requestLibPath: "import request from '@/utils/request'",
    schemaPath: 'http://localhost:8123/api/v3/api-docs',
    serversPath: './src',
} as GenerateServiceProps
