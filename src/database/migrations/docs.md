As migrações no WatermelonDB são usadas para adicionar novas tabelas e colunas ao banco de dados de maneira compatível com versões anteriores¹. Aqui estão os passos para configurar e usar migrações no WatermelonDB:

1. **Configuração das Migrações**: Adicione um novo arquivo para migrações¹:

```javascript
// app/model/migrations.js
import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations'

export default schemaMigrations({
  migrations: [
    // Adicione as definições de migração aqui mais tarde
  ],
})
```

2. **Conecte as migrações à configuração do adaptador do banco de dados**¹:

```javascript
// index.js
import migrations from 'model/migrations'

const adapter = new SQLiteAdapter({
  schema: mySchema,
  migrations,
})
```

3. **Fluxo de trabalho das Migrações**: Quando você faz alterações no esquema, certifique-se de fazer isso nesta ordem específica, para minimizar a probabilidade de cometer um erro¹.

- **Passo 1**: Adicione uma nova migração¹.
- **Passo 2**: Faça alterações correspondentes no esquema¹.
- **Passo 3**: Aumente a versão do esquema¹.

Por favor, note que este é apenas um exemplo simplificado e pode precisar ser ajustado para atender às necessidades específicas da sua aplicação.

Source: Conversation with Bing, 20/08/2023
(1) Migrations | WatermelonDB. https://watermelondb.dev/docs/Advanced/Migrations.
(2) GitHub - Nozbe/WatermelonDB: Reactive & asynchronous database for .... https://github.com/Nozbe/WatermelonDB.
(3) Using WatermelonDB for offline data sync - LogRocket Blog. https://blog.logrocket.com/watermelondb-offline-data-sync/.
