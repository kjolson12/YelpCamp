const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');

// show all camps
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

// create camp
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
    const campground = await Campground(req.body.campground);
    campground.author = req.user._id;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

// show one camp
module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find this campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
};

// edit a camp
module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot edit this campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
};

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const newImages = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...newImages);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

// delete a camp
module.exports.deleteCampground = async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Campground successfully deleted.');
    res.redirect('/campgrounds');
};