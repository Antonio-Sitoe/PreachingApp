
```javascript
 Para atualizar um relatório a partir do id do mesmo, você pode fazer o seguinte:

// Definir uma função que recebe o id e os novos dados do relatório como parâmetros
const updateReport = (id, newData) => {
  // Obter uma instância do RealmDB
  const realm = useRealm();

  // Abrir uma transação no RealmDB
  realm.write(() => {
    // Obter o objeto Record correspondente ao id
    let record = realm.objectForPrimaryKey('Record', id);

    // Se o objeto Record existir, atualizar os seus dados com os novos dados
    if (record) {
      Object.assign(record, newData);
    }
  });
};

```
