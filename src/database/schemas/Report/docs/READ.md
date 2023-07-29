```javascript
Para buscar os dados a partir de um mês específico usando useQuery, você pode fazer o seguinte:

// Importar o hook useQuery do @realm/react
import { useQuery } from '@realm/react';

// Definir uma função que recebe o ano e o nome do mês como parâmetros
const getRecordsByMonth = (year, monthName) => {
  // Obter uma instância do RealmDB
  const realm = useRealm();

  // Definir uma consulta que filtra os registros pelo ano e pelo nome do mês
  const query = `reportYear == "${year}" AND monthName == "${monthName}"`;

  // Usar o hook useQuery para obter os resultados da consulta
  const records = useQuery(Record, query);

  // Retornar os resultados da consulta
  return records;
};

```
