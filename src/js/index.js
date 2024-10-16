// El styles lo importamos aquí, ya se carga después al compilar todo
import '../scss/styles.scss';

const breedsSelect = document.getElementById('breeds');
const subBreedsSelect = document.getElementById('sub-breeds');
const generateElement = document.getElementById('generate');
const dogPictureElement = document.getElementById('dog-picture');

const printAllBreeds = breeds => {
  const fragment = document.createDocumentFragment();
  const newOption = document.createElement('option');
  newOption.textContent = 'Select Breed';
  newOption.value = 'default';
  fragment.append(newOption);
  breeds.forEach(breed => {
    const newOption = document.createElement('option');
    newOption.textContent = breed;
    newOption.value = breed;
    fragment.append(newOption);
  });

  breedsSelect.append(fragment);
};

const printSubBreeds = subBreeds => {
  subBreedsSelect.textContent = '';
  const fragment = document.createDocumentFragment();
  if (subBreeds.length > 1) {
    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Seleccione una subraza';
    defaultOption.value = '';
    fragment.append(defaultOption);
  }
  subBreeds.forEach(subBreed => {
    const newOption = document.createElement('option');
    newOption.textContent = subBreed;
    newOption.value = subBreed;
    fragment.append(newOption);
  });

  subBreedsSelect.append(fragment);
  subBreedsSelect.classList.remove('d-none');
};

const getAllBreeds = async () => {
  try {
    const response = await fetch('https://dog.ceo/api/breeds/list/all');
    const data = await response.json();
    const allBreeds = Object.keys(data.message);
    printAllBreeds(allBreeds);
  } catch (error) {
    console.log(error);
  }
};

const getSubBreeds = async breed => {
  try {
    const response = await fetch(`https://dog.ceo/api/breed/${breed}/list`);
    const data = await response.json();
    const subBreeds = data.message;
    if (subBreeds.length > 0) {
      printSubBreeds(subBreeds);
    } else {
      subBreedsSelect.classList.add('d-none');
    }
  } catch (error) {
    console.log(error);
  }
};

const getRandomBreedImage = async (breed, subBreed) => {
  try {
    if ((breed = 'default')) {
      return;
    }
    const url = subBreed
      ? `https://dog.ceo/api/breed/${breed}/${subBreed}/images/random`
      : `https://dog.ceo/api/breed/${breed}/images/random`;
    const response = await fetch(url);
    const data = await response.json();
    const imageUrl = data.message;
    dogPictureElement.src = imageUrl;
    dogPictureElement.alt = `Random ${subBreed ? `${subBreed} ` : ''}${breed} image`;
  } catch (error) {
    console.log(error);
  }
};

const generateFuncion = () => {
  const selectedBreed = breedsSelect.value;
  let selectedSubBreed = subBreedsSelect.value;
  if (subBreedsSelect.classList.contains('d-none')) {
    selectedSubBreed = null;
  }
  if (selectedBreed) {
    if (!selectedSubBreed) {
      getRandomBreedImage(selectedBreed);
    } else {
      getRandomBreedImage(selectedBreed, selectedSubBreed);
    }
  }
  dogPictureElement.classList.remove('d-none');
};

const changeOptionFunction = () => {
  const selectedBreed = breedsSelect.value;
  if (selectedBreed) {
    getSubBreeds(selectedBreed);
  } else {
    subBreedsSelect.classList.add('d-none');
  }
};

getAllBreeds();

breedsSelect.addEventListener('change', changeOptionFunction);
generateElement.addEventListener('click', generateFuncion);
