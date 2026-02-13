import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true, trim: true },
  productBrand: { type: String, trim: true },
  productPrice: { type: Number, required: true },
  productPicture: { type: String }, // path to uploaded image
  productCategory: {
    type: String,
    enum: ['Solar Panels', 'Solar Inverter', 'Others'],
    default: 'Others'
  },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
