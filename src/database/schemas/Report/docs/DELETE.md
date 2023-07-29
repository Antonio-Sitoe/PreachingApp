```javascript
Para apagar um relatório, você pode fazer o seguinte:

// Definir uma função que recebe o id do relatório como parâmetro
const deleteReport = (id) => {
  // Obter uma instância do RealmDB
  const realm = useRealm();

  // Abrir uma transação no RealmDB
  realm.write(() => {
    // Obter o objeto Record correspondente ao id
    let record = realm.objectForPrimaryKey('Record', id);

    // Se o objeto Record existir, apagar ele do banco de dados
    if (record) {
      realm.delete(record);
    }
  });
};

```
