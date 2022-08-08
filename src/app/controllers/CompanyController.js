const Company = require('../models/Company');
const User = require('../models/User');

class CompanyController {
  async index(req, res) {
    const company = await Company.find();

    return res.json(company);
  }

  async store(req, res) {
    const CompanyExists = await Company.findOne({
      cnpj: req.body.cnpj,
    });

    if (CompanyExists) {
      return res.status(400).json({ error: 'CNPJ já cadastrado.' });
    }
    const company = await Company.create(req.body);

    return res.json(company);
  }

  async show(req, res) {
    const company = await Company.findById(req.params.id);

    return res.json(company);
  }

  async update(req, res) {
    const company = await Company.findById(req.params.id); // busca a empresa pela PK

    await company.update(req.body, { new: true });

    return res.json(company);
  }

  async destroy(req, res) {
    await Company.findOneAndDelete(req.params.id);

    return res.json();
  }
}

module.exports = new CompanyController();
