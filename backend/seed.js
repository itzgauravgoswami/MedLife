const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Models
const Admin = require('./models/Admin');
const Doctor = require('./models/Doctor');
const User = require('./models/User');
const DeliveryPartner = require('./models/DeliveryPartner');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

const seedDatabase = async () => {
  try {
    console.log('Starting database seed...\n');

    // Create Admin (if not exists)
    const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      const admin = new Admin({
        name: 'Super Admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD
      });
      await admin.save();
      console.log('✓ Admin account created');
    } else {
      console.log('✓ Admin account already exists');
    }

    // Create Verified Doctor (if not exists)
    const doctorExists = await Doctor.findOne({ email: 'doctor@medlife.com' });
    if (!doctorExists) {
      const doctor = new Doctor({
        name: 'Dr. John Smith',
        email: 'doctor@medlife.com',
        password: 'doctor123',
        specialty: 'General Physician',
        experience: 10,
        qualifications: 'MBBS, MD',
        phoneNumber: '9876543210',
        clinicName: 'MedLife Clinic',
        clinicAddress: '123 Health Street, Medical City',
        consultationFee: 500,
        registrationNumber: 'MED2024001',
        isVerified: true
      });
      await doctor.save();
      console.log('✓ Doctor account created (verified)');
    } else {
      // Update existing doctor to verified
      await Doctor.updateOne({ email: 'doctor@medlife.com' }, { isVerified: true });
      console.log('✓ Doctor account verified');
    }

    // Create Patient (if not exists)
    const patientExists = await User.findOne({ email: 'patient@medlife.com' });
    if (!patientExists) {
      const patient = new User({
        name: 'Jane Doe',
        email: 'patient@medlife.com',
        password: 'patient123',
        phone: '9876543211',
        age: 30,
        gender: 'female',
        address: {
          street: '456 Wellness Ave',
          city: 'Health City',
          state: 'Medical State',
          zipCode: '123456'
        },
        bloodGroup: 'O+',
        emergencyContact: {
          name: 'John Doe',
          phone: '9876543212',
          relation: 'Spouse'
        }
      });
      await patient.save();
      console.log('✓ Patient account created');
    } else {
      console.log('✓ Patient account already exists');
    }

    // Create Verified Delivery Partner (if not exists)
    const deliveryExists = await DeliveryPartner.findOne({ email: 'delivery@medlife.com' });
    if (!deliveryExists) {
      const delivery = new DeliveryPartner({
        name: 'Mike Wilson',
        email: 'delivery@medlife.com',
        password: 'delivery123',
        phone: '9876543213',
        vehicleType: 'bike',
        vehicleNumber: 'DL01AB1234',
        licenseNumber: 'DL1234567890',
        aadharNumber: '123456789012',
        isVerified: true,
        isAvailable: true
      });
      await delivery.save();
      console.log('✓ Delivery Partner account created (verified)');
    } else {
      // Update existing delivery partner to verified
      await DeliveryPartner.updateOne({ email: 'delivery@medlife.com' }, { isVerified: true });
      console.log('✓ Delivery Partner account verified');
    }

    console.log('\n✅ Database seeding completed successfully!\n');
    console.log('Test Credentials:');
    console.log('─────────────────────────────────────');
    console.log('Admin:');
    console.log('  Email: goswamigaurav2005@gmail.com');
    console.log('  Password: admin@2005\n');
    console.log('Doctor:');
    console.log('  Email: doctor@medlife.com');
    console.log('  Password: doctor123\n');
    console.log('Patient:');
    console.log('  Email: patient@medlife.com');
    console.log('  Password: patient123\n');
    console.log('Delivery Partner:');
    console.log('  Email: delivery@medlife.com');
    console.log('  Password: delivery123');
    console.log('─────────────────────────────────────\n');

    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
