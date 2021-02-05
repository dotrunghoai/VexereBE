const uploadAvatar = async (req, res) => {
  try {
    req.user.avatar = req.file.path;
    let result = await req.user.save();
    result = result.deleteField();
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong !" });
  }
};

module.exports = { uploadAvatar };
