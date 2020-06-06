<template>
  <div>
    <div class="table-responsive">
      <table class="table table-hover table-bordered">
        <thead>
          <tr class="text-center">
            <th>Name</th>
            <th>Credits</th>
            <th>Grade</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cls in classes" :key="cls.id">
            <td class="text-center">
              <input
                :value="cls.name"
                class="text"
                @blur="renameClass($event, cls.id)"
                @keyup.enter="$event.target.blur()"
              />
            </td>
            <td class="text-center">
              <input :value="cls.credits" class="text" />
            </td>
            <td class="text-center">
              <select :value="cls.grade">
                <option
                  v-for="option in gpaScale"
                  :key="cls.id + '_' + option.text"
                  :value="option.value"
                  >{{ option.text }}</option
                >
              </select>
            </td>
            <td class="text-center">
              <button class="btn btn-danger">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: ["activeSchool"],
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["getGPATypes", "getGPALevels"]),
    ...mapGetters({
      gpas: "getGPAS",
      activeSemester: "semesters/getActiveSemester",
    }),
    classes() {
      return this.activeSemester
        ? this.$store.getters["classes/getClassesForSemester"](
            this.activeSemester.id
          )
        : [];
    },
    currentScale() {
      return this.activeSchool ? this.activeSchool.scale : false;
    },
    gpaScale() {
      return this.gpas[this.currentScale];
    },
  },
  methods: {
    renameClass(event, classId) {
      const newName = event.target.value;
      this.$store.dispatch("classes/updateClassName", {
        classId,
        newName,
      });
    },
  },
};
</script>
