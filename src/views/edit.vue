<template>
  <div class="container mt-5" v-if="employee">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h2 class="text-center">Edit Employee</h2>
        <form @submit.prevent="updateEmployee">
          <div class="form-floating mb-3">
            <input type="text" v-model="employee.employee_name" class="form-control" id="floatingInput"
              placeholder="Enter name" required />
            <label for="floatingInput">Name</label>
          </div>

          <div class="form-floating mb-3">
            <select v-model="employee.department_name" class="form-select" id="floatingDepartment" required>
              <option value="" disabled>Select Department</option>
              <option v-for="department in departments" :key="department.id" :value="department.id">
                {{ department.name }}
              </option>
            </select>
            <label for="floatingDepartment">Department</label>
          </div>

          <div class="form-floating mb-3">
            <select v-model="employee.nationality_name" class="form-select" id="floatingNationality" required>
              <option value="" disabled>Select Nationality</option>
              <option v-for="nationality in nationalities" :key="nationality.id" :value="nationality.id">
                {{ nationality.name }}
              </option>
            </select>
            <label for="floatingNationality">Nationality</label>
          </div>

          <div class="form-floating mb-3">
            <select v-model="employee.religion_name" class="form-select" id="floatingReligion" required>
              <option value="" disabled>Select Religion</option>
              <option v-for="religion in religions" :key="religion.id" :value="religion.id">
                {{ religion.name }}
              </option>
            </select>
            <label for="floatingReligion">Religion</label>
          </div>

          <div class="form-floating mb-2 ">
            <select v-model="employee.position_name" class="form-select" id="floatingPosition" required>
              <option value="" disabled>Select Position</option>
              <option v-for="position in positions" :key="position.id" :value="position.id">
                {{ position.title }}
              </option>
            </select>
            <label for="floatingPosition">Position</label>
          </div>

          <div class="mb-3">
            <div class="container">
              <h5 v-if="employee.employee_signature">Signature:</h5>
              <img v-if="employee.employee_signature && !signaturePadActive"
                :src="`http://localhost:8000/storage/${employee.employee_signature}`" alt="Employee Signature"
                style="width: 100%; height: auto; border: 2px solid #000; border-radius: 5px;" />

              <VueSignaturePad v-if="signaturePadActive" id="signature" width="100%" height="400px" ref="signaturePad"
                :options="options" />

              <div class="buttons">
                <button type="button" class="btn btn-primary" @click="undo">Undo</button>
                <button type="button" class="btn btn-primary" @click="clearSignature">Clear</button>
                <button type="button" class="btn btn-primary" @click="change">Change Color</button>
                <button type="button" class="btn btn-primary" @click="resume">Resume Color</button>
                <button type="button" class="btn btn-primary" @click="changeSignature">Change Signature</button>
              </div>
            </div>
          </div>

          <button type="submit" class="btn btn-primary w-100">
            Update
          </button>
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
      employee: null,
      departments: [],
      nationalities: [],
      religions: [],
      positions: [],
      options: {
        penColor: "#c0f",
      },
      signaturePadActive: false,
    };
  },
  created() {
    this.fetchEmployeeData();
  },
  methods: {
    async fetchEmployeeData() {
      const employeeId = this.$route.params.id;

      try {
        const response = await axios.get(`/employees/${employeeId}/edit`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        this.employee = response.data.employee;
        this.departments = response.data.departments;
        this.nationalities = response.data.nationalities;
        this.religions = response.data.religions;
        this.positions = response.data.positions;

        if (this.employee.signature_url) {
          this.$refs.signaturePad.fromDataURL(this.employee.signature_url); 
        }

      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    },

    async updateEmployee() {
      const formData = new FormData();
      formData.append('name', this.employee.employee_name);
      formData.append('department_id', this.employee.department_name);
      formData.append('nationality_id', this.employee.nationality_name);
      formData.append('religion_id', this.employee.religion_name);
      formData.append('position_id', this.employee.position_name);

      formData.append('_method', 'PUT');

      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      if (!isEmpty) {
        const signatureBlob = this.dataURLToBlob(data);
        formData.append('signature', signatureBlob, 'signature.jpeg');
      }

      try {
        const response = await axios.post(`/employees/${this.employee.id}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log("Employee updated:", response.data);
        this.$router.push({ name: "index" });
      } catch (error) {
        console.error("Error updating employee:", error);
        if (error.response && error.response.data.errors) {
          console.error("Validation errors:", error.response.data.errors);
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

    clearSignature() {
      this.$refs.signaturePad.clearSignature();
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

    changeSignature() {
      this.signaturePadActive = true;
    },
  },
};
</script>

<style>
.signature-container {
  text-align: center;
  margin-top: 20px;
}

.signature-image {
  width: 100%;
  max-width: 400px;
  height: 200px;
  border: 2px solid #007bff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-top: 10px;
}

#signature {
  border: double 3px transparent;
  border-radius: 5px;
  background-image: linear-gradient(white, white),
    radial-gradient(circle at top left, #4bc5e8, #9f6274);
  background-origin: border-box;
  background-clip: content-box, border-box;
}

.container {
  width: 100%;
  padding: 8px 16px;
}

.buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 8px;
}
</style>
