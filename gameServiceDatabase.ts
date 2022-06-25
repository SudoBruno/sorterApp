import db from "./database" 

/**
 * INICIALIZAÇÃO DA TABELA
 * - Executa sempre, mas só cria a tabela caso não exista (primeira execução)
 */
db.transaction((tx: { executeSql: (arg0: string) => void; }) => {
  //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
  //tx.executeSql("DROP TABLE Games;");
  //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>

  const p = tx.executeSql(
    "CREATE TABLE IF NOT EXISTS Games (id INTEGER PRIMARY KEY AUTOINCREMENT, sortedNumbers TEXT);"
  );

  console.log("PPPP", db);
  

});

/**
 * CRIAÇÃO DE UM NOVO REGISTRO
 * - Recebe um objeto;
 * - Retorna uma Promise:
 *  - O resultado da Promise é o ID do registro (criado por AUTOINCREMENT)
 *  - Pode retornar erro (reject) caso exista erro no SQL ou nos parâmetros.
 */
const create = (obj: { sortedNumbers: any; }) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      //comando SQL modificável
      tx.executeSql(
        "INSERT INTO Games (sortedNumbers) values (?);",
        [obj.sortedNumbers],
        //-----------------------
        (_: any, { rowsAffected, insertId }: any) => {
          if (rowsAffected > 0) resolve(insertId);
          else reject("Error inserting obj: " + JSON.stringify(obj)); // insert falhou
        },
        (_: any, error: any) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};

/**
 * ATUALIZA UM REGISTRO JÁ EXISTENTE
 * - Recebe o ID do registro e um OBJETO com valores atualizados;
 * - Retorna uma Promise:
 *  - O resultado da Promise é a quantidade de registros atualizados;
 *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL.
 */
const update = (id: string, obj: { sortedNumbers: any; }) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      //comando SQL modificável
      tx.executeSql(
        "UPDATE Games SET sortedNumbers=? WHERE id=?;",
        [obj.sortedNumbers],
        //-----------------------
        (_: any, { rowsAffected }: any) => {
          if (rowsAffected > 0) resolve(rowsAffected);
          else reject("Error updating obj: id=" + id); // nenhum registro alterado
        },
        (_: any, error: any) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};

/**
 * BUSCA UM REGISTRO POR MEIO DO ID
 * - Recebe o ID do registro;
 * - Retorna uma Promise:
 *  - O resultado da Promise é o objeto (caso exista);
 *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL.
 */
const find = (id: string) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx:any) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM Games WHERE id=?;",
        [id],
        //-----------------------
        (_: any, { rows }: any) => {
          if (rows.length > 0) resolve(rows._array[0]);
          else reject("Obj not found: id=" + id); // nenhum registro encontrado
        },
        (_: any, error: any) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};

/**
 * BUSCA UM REGISTRO POR MEIO DOS NÚMEROS (sortedNumbers)
 * - Recebe os numeros do jogo;
 * - Retorna uma Promise:
 *  - O resultado da Promise é um array com os objetos encontrados;
 *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL;
 *  - Pode retornar um array vazio caso nenhum objeto seja encontrado.
 */
const findBysortedNumbers = (sortedNumbers: string) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx:any) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM Games WHERE sortedNumbers LIKE ?;",
        [sortedNumbers],
        //-----------------------
        (_: any, { rows }: any) => {
          if (rows.length > 0) resolve(rows._array);
          else reject("Obj not found: sortedNumbers=" + sortedNumbers); // nenhum registro encontrado
        },
        (_: any, error: any) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};

/**
 * BUSCA TODOS OS REGISTROS DE UMA DETERMINADA TABELA
 * - Não recebe parâmetros;
 * - Retorna uma Promise:
 *  - O resultado da Promise é uma lista (Array) de objetos;
 *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL;
 *  - Pode retornar um array vazio caso não existam registros.
 */
const all = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM Games;",
        [],
        //-----------------------
        (_: any, { rows }: any) => resolve(rows._array),
        (_: any, error: any) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};

/**
 * REMOVE UM REGISTRO POR MEIO DO ID
 * - Recebe o ID do registro;
 * - Retorna uma Promise:
 *  - O resultado da Promise a quantidade de registros removidos (zero indica que nada foi removido);
 *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL.
 */
const remove = (id: any) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      //comando SQL modificável
      tx.executeSql(
        "DELETE FROM Games WHERE id=?;",
        [id],
        //-----------------------
        (_: any, { rowsAffected }: any) => {
          resolve(rowsAffected);
        },
        (_: any, error: any) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};

/**
 * REMOVE A TABELA Games
 * - 
 * - Retorna uma Promise:
 *  - O resultado da Promise a quantidade de registros removidos (zero indica que nada foi removido);
 *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL.
 */



 const createTable = () => {

  return new Promise((resolve, reject) => {
    db.transaction((tx:any) => {
      //comando SQL modificável
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS Games (id INTEGER PRIMARY KEY AUTOINCREMENT, sortedNumbers TEXT);",
        [],
        //-----------------------
        (_: any, { rows }: any) => resolve(rows._array),
        (_: any, error: any) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};

const dropTable = () => {

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      //comando SQL modificável
      tx.executeSql(
        "DROP TABLE Games;",
        [],
        //-----------------------
        (_: any, { rows }: any) => resolve(rows._array),
        (_: any, error: any) => reject(error) // erro interno em tx.executeSql
      );
    });
  });

};

export default {
  createTable,
  create,
  update,
  find,
  findBysortedNumbers,
  all,
  remove,
  dropTable,
};