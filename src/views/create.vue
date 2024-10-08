<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h2 class="text-center">Add New Employee</h2>
        <form @submit.prevent="addEmployee">
          <div class="form-floating mb-3">
            <input type="text" v-model="name" class="form-control" id="floatingInput" placeholder="" required>
            <label for="floatingInput">Name</label>
          </div>

          <div class="form-floating mb-3">
            <select v-model="departmentId" class="form-select" id="floatingDepartment" required>
              <option value="">Select Department</option>
              <option v-for="department in departments" :key="department.id" :value="department.id">{{ department.name
                }}</option>
            </select>
            <label for="floatingDepartment">Department</label>
          </div>

          <div class="form-floating mb-3">
            <select v-model="nationalityId" class="form-select" id="floatingNationality" required>
              <option value="">Select Nationality</option>
              <option v-for="nationality in nationalities" :key="nationality.id" :value="nationality.id">{{
                nationality.name }}</option>
            </select>
            <label for="floatingNationality">Nationality</label>
          </div>

          <div class="form-floating mb-3">
            <select v-model="religionId" class="form-select" id="floatingReligion" required>
              <option value="">Select Religion</option>
              <option v-for="religion in religions" :key="religion.id" :value="religion.id">{{ religion.name }}</option>
            </select>
            <label for="floatingReligion">Religion</label>
          </div>

          <div class="form-floating mb-3">
            <select v-model="positionId" class="form-select" id="floatingPosition" required>
              <option value="">Select Position</option>
              <option v-for="position in positions" :key="position.id" :value="position.id">{{ position.title }}
              </option>
            </select>
            <label for="floatingPosition">Position</label>
          </div>

       

          <div class="mb-3">
            <div class="container">
              <div class="container">
                <VueSignaturePad id="signature" width="100%" height="400px" ref="signaturePad" :options="options" />
              </div>
              <div class="buttons">
                <button type="button" class="btn btn-primary" @click="undo">Undo</button>
                <button type="button" class="btn btn-primary" @click="change">Change Color</button>
                <button type="button" class="btn btn-primary" @click="resume">Resume Color</button>
              </div>
            </div>
          </div>

          <button type="submit" class="btn btn-primary w-100">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../axios";

export default {
  data() {
    return {
      name: "",
      departmentId: "",
      nationalityId: "",
      religionId: "",
      positionId: "",
      signature: null, 
      departments: [],
      nationalities: [],
      religions: [],
      positions: [],
      options: {
        penColor: "#c0f",
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get('/create', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.departments = response.data.departments;
        this.nationalities = response.data.nationalities;
        this.religions = response.data.religions;
        this.positions = response.data.positions;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.signature = file; 
      }
    },
    async addEmployee() {
    try {
      const formData = new FormData();
      formData.append('name', this.name);
      formData.append('department_id', this.departmentId);
      formData.append('nationality_id', this.nationalityId);
      formData.append('religion_id', this.religionId);
      formData.append('position_id', this.positionId);

      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      if (!isEmpty) {
        const signatureBlob = this.dataURLToBlob(data); 
        formData.append('signature', signatureBlob, 'signature.jpeg'); 
      }

      

      const res = await axios.post('/employees', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log("Employee added:", res.data);
      this.$router.push({ name: 'index' });
    } catch (error) {
      if (error.response) {
        console.error("Error adding employee:", error.response.data);
        console.error("Validation Errors:", error.response.data.errors);
      } else {
        console.error("Error adding employee:", error.message);
      }
    }
  },
  
  dataURLToBlob(dataURL) {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  },
    undo() {
      this.$refs.signaturePad.undoSignature();
    },
    save() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();

      alert("Open DevTools see the save data.");
      console.log(isEmpty);
      console.log(data);
    },
    change() {
      this.options = {
        penColor: "#00f",
      };
    },
    resume() {
      this.options = {
        penColor: "#c0f",
      };
    },
  },
};
</script>

<style>
#signature {
  border: double 3px transparent;
  border-radius: 5px;
  background-image: linear-gradient(white, white),
    radial-gradient(circle at top left, #4bc5e8, #9f6274);
  background-origin: border-box;
  background-clip: content-box, border-box;
}

.container {
  width: "100%";
  padding: 8px 16px;
}

.buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 8px;
}
</style>
