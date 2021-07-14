import firebaseInstance from '../../';

export default {
  create, get, remove, set,
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
  return result.val()
}

//
async function remove(entity, id) {
  await db.ref(`${entity}`).remove()
  return {id}
}
