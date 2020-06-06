<template>
  <div>
    <h4 class="text-center">Semesters</h4>
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
        <button
          type="button"
          class="btn btn-danger btn-sm ml-auto"
          @click.stop.prevent="deleteSemester(sem.id)"
        >
          <i class="far fa-trash"></i>
        </button>
      </a>
    </div>
    <div class="row mt-4">
      <div class="col-12 text-center">
        <button class="btn btn-outline-dark">Add Semester</button>
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
      activeSemester: "semesters/getActiveSemester" || 0,
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
    deleteSemester(semesterId) {
      console.log(semesterId);
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
