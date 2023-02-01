const Company = require('../models/Company');
const Image = require('../models/Image');

class CompanyController {
  async index(req, res) {
    const company = await Company.find().populate('avatar');

    return res.json(company);
  }

  async store(req, res) {
    let image = null;

    if (req.file) {
      const {
        originalname: name,
        size,
        key,
        location: url = '',
      } = req.file;

      image = await Image.create({
        name,
        size,
        key,
        url,
      });
    }

    const {name, cnpj} = req.body;

    const company = await Company.create({
      name,
      cnpj,
      avatar: image,
    });

    return res.json(company);
  }

  async show(req, res) {
    const company = await Company.findById(req.params.id);

    return res.json(company);
  }

  async update(req, res) {
    const company = await Company.findById(req.params.id); // busca a empresa pela PK

    await company.update(req.body, {new: true});

    return res.json(company);
  }

  async destroy(req, res) {
    const company = await Company.findById(req.params.id);

    const {avatar: imageId} = company;

    if (imageId) {
      const image = await Image.findById(imageId);

      await image.remove();
    }

    await Company.findOneAndDelete(req.params.id);

    return res.json();
  }
}

module.exports = new CompanyController();
