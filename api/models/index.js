

const db = require('../config/db');


const Category = require('./Categories');
const Gender = require('./Genders');
const Venue = require('./Venues');
const TypeVenue = require('./Type_Venue');
const User = require('./Users');
const TypeUser = require('./Type_Users');
const OwnerAuthorization = require('./Owner_Authorization');
const TypePaymentMethods = require('./Types_Payment_Methods');
const PaymentsMethods = require('./Payments_Methods');
const SecurityMeasures = require('./Security_Measures');
const UserFavorites = require('./User_Favorites');
const VenueAssistance = require('./Venue_Assistance');





// ==================== Relaciones ====================


TypeUser.hasMany(User, {
    foreignKey: 'type_users_id',
    as: 'users'
});

User.belongsTo(TypeUser, {
    foreignKey: 'type_users_id',
    as: 'type_user'
});


// Gender y User
Gender.hasMany(User, {
    foreignKey: 'gender_id',
    as: 'users'
});

User.belongsTo(Gender, {
    foreignKey: 'gender_id',
    as: 'gender'
});


// TypeVenue y Venue
TypeVenue.hasMany(Venue, {
    foreignKey: 'type_venue_id',
    as: 'venues'
});

Venue.belongsTo(TypeVenue, {
    foreignKey: 'type_venue_id',
    as: 'type_venue'
});


// User y Venue
User.hasMany(Venue, {
    foreignKey: 'user_id',
    as: 'venues'
});

Venue.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});


// TypePaymentMethods y PaymentsMethods
TypePaymentMethods.hasMany(PaymentsMethods, {
    foreignKey: 'types_payment_methods_id',
    as: 'payments_methods'
});

PaymentsMethods.belongsTo(TypePaymentMethods, {
    foreignKey: 'types_payment_methods_id',
    as: 'type_payment_method'
});


// User y PaymentsMethods
User.hasMany(PaymentsMethods, {
    foreignKey: 'user_id',
    as: 'payments_methods'
});

PaymentsMethods.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});


// Venue y SecurityMeasures
Venue.hasOne(SecurityMeasures, {
    foreignKey: 'venue_id',
    as: 'security_measures'
});

SecurityMeasures.belongsTo(Venue, {
    foreignKey: 'venue_id',
    as: 'venue'
});


// Venue y OwnerAuthorization
Venue.hasOne(OwnerAuthorization, {
    foreignKey: 'venue_id',
    as: 'owner_authorization'
});

OwnerAuthorization.belongsTo(Venue, {
    foreignKey: 'venue_id',
    as: 'venue'
});


// User y UserFavorites
User.hasMany(UserFavorites, {
    foreignKey: 'user_id',
    as: 'favorites'
});

UserFavorites.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});


// Venue y UserFavorites
Venue.hasMany(UserFavorites, {
    foreignKey: 'venue_id',
    as: 'favorites'
});

UserFavorites.belongsTo(Venue, {
    foreignKey: 'venue_id',
    as: 'venue'
});


// User y VenueAssistance
User.hasMany(VenueAssistance, {
    foreignKey: 'user_id',
    as: 'venue_assistance'
});

VenueAssistance.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});


// Venue y VenueAssistance
Venue.hasMany(VenueAssistance, {
    foreignKey: 'venue_id',
    as: 'assistance'
});

VenueAssistance.belongsTo(Venue, {
    foreignKey: 'venue_id',
    as: 'venue'
});


// ==================== Crear objeto models ====================
const models = {
    Category,
    Gender,
    Venue,
    TypeVenue,
    User,
    TypeUser,
    OwnerAuthorization,
    TypePaymentMethods,
    PaymentsMethods,
    SecurityMeasures,
    UserFavorites,
    VenueAssistance
};



module.exports = {
    db,
    ...models,
    models
};
