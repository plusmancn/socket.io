exports.checkIn_Post = function(req,res) {
    var info = {
        from:req.body.from,
        to:req.body.to,
        message:req.body.message
    }

    io.to(info.to).emit('checkInMessage', info.message);

    var JuJsonRes = {
        errorCode:0,
        errorMessage:'success'
    }

    res.send(JuJsonRes);
}