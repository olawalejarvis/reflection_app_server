import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../db';

const Reflection = {
  /**
   * Create A Reflection
   * @param {object} req 
   * @param {object} res
   * @returns {object} reflection object 
   */
  async create(req, res) {
    const text = `INSERT INTO
      reflections(id, success, low_point, take_away, created_date, modified_date)
      VALUES($1, $2, $3, $4, $5, $6)
      returning *`;
    const values = [
      uuidv4(),
      req.body.success,
      req.body.low_point,
      req.body.take_away,
      moment(new Date()),
      moment(new Date())
    ];

    try {
      const { rows } = await db.query(text, values);
      return res.status(201).send(rows[0]);
    } catch(error) {
      return res.status(400).send(error);
    }
  },
  /**
   * Get All Reflection
   * @param {object} req 
   * @param {object} res 
   * @returns {object} reflections array
   */
  async getAll(req, res) {
    const findAllQuery = 'SELECT * FROM reflections';
    try {
      const { rows, rowCount } = await db.query(findAllQuery);
      return res.status(200).send({ rows, rowCount });
    } catch(error) {
      return res.status(400).send(error);
    }
  },
  /**
   * Get A Reflection
   * @param {object} req 
   * @param {object} res
   * @returns {object} reflection object
   */
  async getOne(req, res) {
    const text = 'SELECT * FROM reflections WHERE id = $1';
    try {
      const { rows } = await db.query(text, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).send({'message': 'reflection not found'});
      }
      return res.status(200).send(rows[0]);
    } catch(error) {
      return res.status(400).send(error)
    }
  },
  /**
   * Update A Reflection
   * @param {object} req 
   * @param {object} res 
   * @returns {object} updated reflection
   */
  async update(req, res) {
    const findOneQuery = 'SELECT * FROM reflections WHERE id=$1';
    const updateOneQuery =`UPDATE reflections
      SET success=$1,low_point=$2,take_away=$3,modified_date=$4
      WHERE id=$5 returning *`;
    try {
      const { rows } = await db.query(findOneQuery, [req.params.id]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'reflection not found'});
      }
      const values = [
        req.body.success || rows[0].success,
        req.body.low_point || rows[0].low_point,
        req.body.take_away || rows[0].take_away,
        moment(new Date()),
        req.params.id
      ];
      const response = await db.query(updateOneQuery, values);
      return res.status(200).send(response.rows[0]);
    } catch(err) {
      return res.status(400).send(err);
    }
  },
  /**
   * Delete A Reflection
   * @param {object} req 
   * @param {object} res 
   * @returns {void} return statuc code 204 
   */
  async delete(req, res) {
    const deleteQuery = 'DELETE FROM reflections WHERE id=$1 returning *';
    try {
      const { rows } = await db.query(deleteQuery, [req.params.id]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'reflection not found'});
      }
      return res.status(204).send({ 'message': 'deleted' });
    } catch(error) {
      return res.status(400).send(error);
    }
  }
}

export default Reflection;
