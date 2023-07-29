``````javascript
Para adicionar um relatório no mês de agosto de 2023 usando o @realm/react, você pode fazer o seguinte:

// Importar o hook useRealm do @realm/react
import { useRealm } from '@realm/react';

// Criar um componente funcional que recebe o relatório como prop
const AddReport = ({ report }) => {
  // Obter uma instância do RealmDB usando o hook useRealm
  const realm = useRealm();

  // Definir uma função para adicionar o relatório ao banco de dados
  const addReport = () => {
    // Abrir uma transação no RealmDB
    realm.write(() => {
      // Obter o objeto Report correspondente ao ano de 2023
      let report2023 = realm.objectForPrimaryKey('Report', '2023');

      // Se o objeto Report não existir, criar um novo
      if (!report2023) {
        report2023 = realm.create('Report', { year: '2023', months: [] });
      }

      // Obter o objeto Month correspondente ao mês de agosto
      let monthAugust = report2023.months.find(
        (month) => month.name === 'august'
      );

      // Se o objeto Month não existir, criar um novo
      if (!monthAugust) {
        monthAugust = realm.create('Month', { name: 'august', records: [] });
      }

      // Adicionar o relatório à lista de registros do mês de agosto
      monthAugust.records.push(report);
    });
  };

  // Retornar um elemento JSX que chama a função addReport ao ser clicado
  return <button onClick={addReport}>Adicionar relatório</button>;
};
```
