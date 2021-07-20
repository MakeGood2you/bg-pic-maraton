import firebaseInstance from '../../';

export default {
  create, get, remove, set, getList,update
  // db
}


const db = firebaseInstance.firebase.database()


async function create(entity, document) {
  return db.ref(entity).push(document);
}

async function set(entity, document) {
  const result = await db.ref(entity).set(document)
  try {
    return result
  } catch (err) {
    return err
  }
}

async function get(entity) {
  const result = await db.ref(entity).once("value")
  console.log(result.val())
  return result.val()
}

async function getList(entity) {
  const list = []
  try {
    const data = await get(entity)
    for (const key in data) {
      const obj = data[key];
      obj.id = key;
      list.push(obj)
    }
    return list.length ? list : null
  } catch (err) {
    console.log(err)
    return err
  }
}

//
async function remove(entity, id) {
  return db.ref(`${entity}`).remove()

}

async function update(entity, document) {
  await db.ref(entity).update(document)
  return {document}
}
