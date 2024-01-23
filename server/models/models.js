const  { DataTypes } = require("sequelize");
const  sequelize = require("./db.js");

const User = sequelize.define('user',{
   login:{type: DataTypes.STRING, unique:true,  allowNull:false},
   email:{type: DataTypes.STRING, unique:true,  allowNull:false },
   avatar:{type: DataTypes.STRING} ,
   password:{type: DataTypes.STRING,  allowNull:false},
   description:{type:DataTypes.TEXT},
   isActivated:{type:DataTypes.BOOLEAN,defaultValue:false,allowNull:false},
   activationLink:{type:DataTypes.STRING},
   blocked:{type:DataTypes.BOOLEAN, defaultValue:false}
   },{updatedAt:false}
)

const Video = sequelize.define('video',{
   title: {type: DataTypes.STRING, allowNull:false },
   videoFileName: {type: DataTypes.STRING, allowNull:false},
   previewFileName: {type: DataTypes.STRING, allowNull:false},
   description: {type: DataTypes.TEXT },
   views: {type: DataTypes.INTEGER, defaultValue: 0}
},{updatedAt:false})


const Genre = sequelize.define('genre',{
   name: {type: DataTypes.STRING, unique:true, allowNull: false},
},{  timestamps: false})


const Commentary = sequelize.define('commentary',{
   text: {type: DataTypes.TEXT, allowNull: false},
},{updatedAt: false})

const Rating = sequelize.define('rating',{
   userId:{
      type:DataTypes.INTEGER,
      allowNull: false,primaryKey:true,
      references:{
         model:User,
         key:'id'
      }},
   videoId:{
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      references:{
         model:Video,
         key:'id',
      }
   },   
   like: {type: DataTypes.BOOLEAN}
},{ timestamps: false})


const Role = sequelize.define('role',{
   roleName:{type:DataTypes.STRING}
},{  timestamps: false})


const Complaint = sequelize.define('complaint',{
   message:{type:DataTypes.STRING},
},{  updatedAt: false})


const TypeComplaint= sequelize.define('typeComplaint',{
   name:{type:DataTypes.STRING, allowNull: false},
},{  timestamps: false})


const Playlist = sequelize.define('playlist',{
   title:{type:DataTypes.STRING, allowNull: false},
   imageFileName: {type: DataTypes.STRING,allowNull:false},
},{updatedAt: false})

//RESTRICT  CASCADE  NO ACTION  SET DEFAULT  SET NULL

User.hasMany(Video, {foreignKey: {allowNull: false},onDelete:'CASCADE',onUpdate:'CASCADE'})
Video.belongsTo(User)

User.hasMany(Commentary, {foreignKey: {allowNull: false},onDelete:'CASCADE',onUpdate:'CASCADE'})
Commentary.belongsTo(User)

User.hasMany(Complaint,{foreignKey: {allowNull: false},onDelete:'CASCADE',onUpdate:'CASCADE'})
Complaint.belongsTo(User)

User.hasMany(Playlist,{foreignKey: {allowNull: false},onDelete:'CASCADE',onUpdate:'CASCADE'})
Playlist.belongsTo(User)

Video.hasMany(Commentary,{foreignKey: {allowNull: false},onDelete:'CASCADE',onUpdate:'CASCADE'})
Commentary.belongsTo(Video)

Video.hasMany(Complaint,{foreignKey: {allowNull: false},onDelete:'CASCADE',onUpdate:'CASCADE'})
Complaint.belongsTo(Video)

Role.hasOne(User,{foreignKey: {allowNull: false},onDelete:'RESTRICT',onUpdate:'CASCADE'})
User.belongsTo(Role)

TypeComplaint.hasMany(Complaint,{onDelete:'RESTRICT',onUpdate:'CASCADE'})
Complaint.belongsTo(TypeComplaint)


User.hasMany(Rating,{foreignKey:{allowNull:false}, onDelete:'SET NULL',onUpdate:'CASCADE'})
Video.hasMany(Rating,{foreignKey:{allowNull:true}, onDelete:'CASCADE',onUpdate:'CASCADE'})


Playlist.belongsToMany(Video, {through:'playlist_video', timestamps:false})
Video.belongsToMany(Playlist,{through:'playlist_video'})

Video.belongsToMany(Genre, {through:'video_genre', timestamps:false})
Genre.belongsToMany(Video,{through:'video_genre'})




module.exports =  {
   User,
   Video,
   Commentary,
   Rating,
   Genre,
   Role,
   Complaint,
   TypeComplaint,
   Playlist
}

