const express = require('express');
const router = express.Router();
const Dog = require('../models/Dog');

router.post('/', async (req, res) => {
    try {
        const newDog = new Dog(req.body);
        const saved = await newDog.save();

        res.status(201).json(saved);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try{
        const dogs = await Dog.find();

        res.status(201).json(dogs);
    }
    catch (error){
        res.status(500).json({ message: error.message });
    }
})

router.get('/:id', async (req, res) => {
    try{
        const dogs = await Dog.findById(req.params.id);;

        if(!dog){
            return res.status(404).json({ message: "Dog not found" });
        }

        res.status(200).json(dogs);
    }
    catch (error){
        res.status(500).json({ message: error.message });
    }
})

router.put('/:id', async (req, res) => {
    try{
        const updateDog = await Dog.findByIdAndUpdate(
            req.params.id, 
            req.body,
        {
            new: true,
            runValidators: true,
        });

        if(!updatedDog){
            res.status(404).json({ message: "Dog not found" });
        }

        res.status(200).json(updateDog);
    }
    catch (error){
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try{
        const deleteDog = await Dog.findByIdAndDelete(req.params.id);

        if(!deleteDog){
            res.status(404).json({ message: "Dog not found" });
        }

        res.status(200).json({ message: "Dog deleted successfully" });
    }
    catch (error){
        res.status(400).json({ message: error.message });
    }
});


module.exports = router;