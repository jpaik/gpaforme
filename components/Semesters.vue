<template>
  <div>
    <h4 class="text-center mt-4">Semesters</h4>
    <div class="list-group">
      <a
        v-for="sem in semesters"
        :key="sem.id"
        href="#"
        role="group"
        :class="{
          'list-group-item list-group-item-action': true,
          'd-flex align-items-center': true,
          'p-2 pl-3': true,
          active:
            activeSemester !== undefined ? sem.id === activeSemester.id : false,
        }"
        @click.prevent="changeActiveSemester(sem.id)"
      >
        <span
          v-show="!isEditing(sem.id)"
          class="mr-auto semester_name_edit"
          @click.stop="toggleEditing(this, sem.id)"
        >
          {{ sem.name ? sem.name : "Semester " + getSemesterLegibleId(sem.id) }}
        </span>
        <input
          v-show="isEditing(sem.id)"
          :ref="'sm_name_' + sem.id"
          type="text"
          :value="sem.name"
          placeholder="Name..."
          class="form-control form-control-sm mr-3"
          @blur="renameSemester($event, sem.id)"
          @keyup.enter="$event.target.blur()"
        />
        <span
          v-show="!isEditing(sem.id)"
          v-if="getSemesterCredits(sem.id)"
          title="Total Credits"
          class="small mr-2"
        >
          ({{ getSemesterCredits(sem.id) }} cr.)
        </span>
        <button
          v-if="semesters.length"
          type="button"
          class="btn btn-danger btn-sm"
          @click.stop.prevent="deleteSemester(sem.id)"
        >
          <i class="far fa-trash"></i>
        </button>
      </a>
    </div>
    <div class="row mt-3">
      <div class="col-12 text-center">
        <button
          class="btn btn-outline-dark btn-sm"
          type="button"
          @click.stop.prevent="addSemester()"
        >
          <i class="far fa-plus"></i> Add Semester
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: ["activeSchool"],
  data() {
    return {
      editing: [],
    };
  },
  computed: {
    ...mapGetters({
      activeSemester: "semesters/getActiveSemester",
    }),
    semesters() {
      return this.activeSchool
        ? this.$store.getters["semesters/getSemestersForSchool"](
            this.activeSchool.id
          )
        : [];
    },
  },
  methods: {
    getSemesterLegibleId(id) {
      if (id) {
        return parseInt(id.split("_").pop()) + 1;
      }
    },
    getSemesterCredits(id) {
      return this.$store.getters["semesters/getCreditsForSemester"](id);
    },
    isEditing(id) {
      return this.editing.indexOf(id) > -1;
    },
    toggleEditing(ev, semesterId) {
      if (this.isEditing(semesterId)) {
        this.editing.splice(this.editing.indexOf(semesterId), 1);
      } else {
        this.editing.push(semesterId);
        this.$nextTick(() => {
          const ref_name = `sm_name_${semesterId}`;
          this.$refs[ref_name][0].focus();
        });
      }
    },
    changeActiveSemester(semesterId) {
      this.$store.dispatch("semesters/updateActiveSemester", semesterId);
    },
    addSemester() {
      this.$store.dispatch("semesters/createSemester");
    },
    deleteSemester(semesterId) {
      this.$store.dispatch("semesters/deleteSemester", semesterId);
    },
    renameSemester(event, semesterId) {
      const newName = event.target.value;
      this.toggleEditing(event, semesterId);
      this.$store.dispatch("semesters/updateSemesterName", {
        semesterId,
        newName,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.semester_name_edit {
  &:hover {
    cursor: text;
  }
}
</style>
