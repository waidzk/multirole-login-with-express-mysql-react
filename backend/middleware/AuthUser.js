import User from "../models/UserModel.js";

//untuk proteksi endpoint user, jadi pada saat ingin mengakses enpoint user misal get all users maka harus login terlebih dahulu
export const verifyUser = async (req, res, next) => {
    if(!req.session.userId) {
        return res.status(401).json({msg: "Mohon login ke akun anda"})
    }
    const user = await User.findOne({
        where: {
          uuid: req.session.userId
        },
      });
      if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
      req.userId = user.id;
      req.role = user.role;
      next();
}

//agar akses terhadap user hanya bisa diakses oleh akun admin saja. tidak bisa di akses oleh user
export const adminOnly = async (req, res, next) => {
    const user = await User.findOne({
        where: {
          uuid: req.session.userId
        },
      });
      if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
      if(user.role!=="admin") return res.status(403).json({ msg: "Akses terlarang!" });
      next();
}