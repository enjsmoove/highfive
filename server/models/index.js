const objection = require('objection');
const Company = require('./Company');
const Industry = require('./Industry');
const Jobpost = require('./Jobpost');
const Location = require('./Location');
const Question = require('./Question');
const User = require('./User');
const Video = require('./Video');
const Submission = require('./Submission');

module.exports = {
  users: {
    get: (cb) => {
      User
        .query()
        .allowEager('[industry]')
        .eager('industry')
        .skipUndefined()
        .then((users) => cb(null, users))
        .catch((err) => cb(err, null));
    },
    getById: () => {

    },
    put: () => {
      // update user here
    },
    /**
     * Posts a user to the db using async/await (Ready for Testing)
     */
    post: async ({ name, email, auth0_id, profile_img, github_url }, cb) => {
      const user = {
        name,
        email,
        auth0_id,
        profile_img,
        github_url
      };
      const userAlreadyExists = await User
        .query()
        .allowEager('[industry, submission.[jobpost]]')
        .first()
        .eager('[industry, submission.[jobpost]]')
        .where(user);

      if (!userAlreadyExists) {
        const newUser = await User
          .query()
          .allowEager('[industry, submission.[jobpost]]')
          .eager('[industry, submission.[jobpost]]')
          .insertAndFetch(user)
          .catch((err) => {
            return cb(err, null);
          });
        cb(null, newUser);
      } else {
        cb(null, userAlreadyExists);
      }
    },
    updateById: async ({ location, linkedin_url, id, industries }, cb) => {
      console.log(linkedin_url, 'linked', industries, 'industries');
      const industriesLength = industries.length;
      /* Patch User (async/await) */
      if (!linkedin_url) {
        const updatedUser = await User
          .query()
          .eager('industry')
          .patchAndFetchById(id, { location_id: location })
          .first()
          .catch((e) => {
            return cb(e, null);
          });
      }
      const updatedUser = await User
        .query()
        .eager('industry')
        .patchAndFetchById(id, { location_id: location, linkedin_url })
        .first()
        .catch((e) => {
          return cb(e, null);
        });

      if (!industriesLength) {
        cb(null, updatedUser);
      }

      if (industriesLength) {
      /* Patch User's industrys */
        industries.map(async (industryId, index) => {
          const industry = await Industry
            .query()
            .findById(industryId);

          if (!industry) {
            console.log('no industry under that name');
            return;
          }
          const relationExists = await industry
            .$relatedQuery('user')
            .where({ user_id: id })
            .first()
            .skipUndefined();

          if (relationExists) {
            if (index === industriesLength - 1) {
              console.log('already related, skip');
              console.log(index, industriesLength);
              const userToReturn = await User
                .query()
                .findById(id)
                .allowEager('[industry]')
                .eager('industry')
                .skipUndefined()
                .catch((e) => {
                  return cb(e, null);
                });
              cb(null, userToReturn);
            }
          } else {
            const industryToRelate = await industry
              .$relatedQuery('user')
              .relate(id)
              .catch((e) => {
                cb(e, null);
              });
            const userToReturn = await User
              .query()
              .findById(id)
              .allowEager('[industry]')
              .eager('industry')
              .skipUndefined()
              .catch((e) => {
                return cb(e, null);
              });

            cb(null, userToReturn);
          }
        });
      }
    },
    deleteIndustryById: async ({ id, industryId }, cb) => {
      await User
        .query()
        .where('id', id)
        .first()
        .then((user) => {
          return user
            .$relatedQuery('industry')
            .unrelate()
            .where('id', industryId)
            .catch(e => cb(e, null));
        })
        .then(() => {
          User
            .query()
            .allowEager('[industry]')
            .eager('industry')
            .where('id', id)
            .first()
            .then((updatedUser) => {
              cb(null, updatedUser);
            })
            .catch(err => cb(err, null));
        })
        .catch(e => cb(e, null));
    }
  },
  companies: {
    getById: (id, cb) => {
      Company
        .query()
        .where('id', id)
        .then((company) => { cb(null, company); })
        .catch((err) => { cb(err, null); });
    },

    createOne: async (body, cb) => {
      const getCompany = await Company
        .query()
        .where('email', body.email)
        .first()
        .catch((err) => { cb(err, null); });

      if (!getCompany) {
        const newCompany = await Company
          .query()
          .insertAndFetch(body)
          .catch((err) => { cb(err, null); });
        cb(null, newCompany);
      } else {
        cb(null, getCompany);
      }
    },

    updateCompany: (id, body, cb) => {
      Company
        .query()
        .update(body)
        .where('id', id)
        .then((company) => { cb(null, company); })
        .catch((err) => { cb(err, null); });
    },
    deleteCompany: (id, cb) => {
      Company
        .query()
        .deleteById(id)
        .then((deleted) => { cb(null, deleted); })
        .catch((err) => { console.log(err); });
    },
    updatePicture: (id, body, cb) => {
      Company
        .query()
        .update(body)
        .where('id', id)
        .skipUndefined()
        .then((result) => { cb(null, result); })
        .catch((err) => { cb(err, null); });
    }
  },
  jobposts: {
    getAllPage: (page, cb) => {
      if (!page) page = 1;
      Jobpost
        .query()
        .page(parseInt(page - 1), 10)
        .allowEager('[company, submission]')
        .eager('[company, submission]')
        .then((jobposts) => {
          cb(null, jobposts);
        })
        .catch((err) => { cb(err, null); });
    },
    getAll: (cb) => {
      Jobpost
        .query()
        .allowEager('[company]')
        .eager('company')
        .then(jobposts => cb(null, jobposts))
        .catch(err => cb(err, null));
    },
    getById: (id, cb) => {
      Jobpost
        .query()
        .where('id', id)
        .allowEager('[company, question, submission]')
        .eager('[company, question, submission]')
        .first()
        .then((jobpost) => { cb(null, jobpost); })
        .catch((err) => { cb(err, null); });
    },
    createOne: (body, cb) => {
      Jobpost
        .query()
        .insertAndFetch(body)
        .then((jobs) => { cb(null, jobs); })
        .catch((err) => { cb(err, null); });
    },
    getJobPostsByCompany: (companyId, cb) => {
      Jobpost
        .query()
        .allowEager('[question]')
        .eager('[question]')
        .where('company_id', companyId)
        .then((jobs) => { cb(null, jobs); })
        .catch((err) => { cb(err, null); });
    },
    updateJobPost: async (id, body, cb) => {
      const jobpost = await Jobpost
        .query()
        .first()
        .where('id', id)
        // .update(body)
        // .then((job) => { cb(null, job); })
        .catch((err) => { cb(err, null); });
      const questions = body;

      let count = 0;
      questions.forEach((question) => {
        jobpost
          .$relatedQuery('question')
            .relate(question.id)
            .catch((e) => {
              cb(e, null);
            });
        count++;
        if(count === questions.length) {
          cb(null, jobpost);
        }
      });
    },

    deleteJobPost: (postId, cb) => {
      Jobpost
        .query()
        .skipUndefined()
        // .allowEager('[question]')
        // .eager('[question]')
        .deleteById(postId)
        .then((jobs) => { cb(null, jobs); })
        .catch((err) => { cb(err, null); });
    }
  },

  submissions: {
    getAll: async (cb) => {
      const submissions = await Submission
        .query()
        .eager('[video, user]')
        .catch(err => cb(err, null));
      cb(null, submissions);
    },
    getAllByUserId: async (id, cb) => {
      const userSubmissions = await User
        .query()
        .eager('[submission, submission.[jobpost, jobpost.question, video]]')
        .where('id', id)
        .skipUndefined()
        .first()
        .catch(err => cb(err, null));
      cb(null, userSubmissions);
    },
    createOne: async (submission, cb) => {
      const insertedSubmission = await Submission
        .query()
        .insert(submission)
        .catch(e => cb(e, null));
      cb(null, insertedSubmission);
    },
    getBySubmissionId: (id, cb) => {
      Submission
        .query()
        .where('id', id)
        .then((submission) => { cb(null, submission) })
        .catch((err) => { cb(err, null); });
    },
    getAllForJobPost: (jobpost_id, cb) => {
      Submission
        .query()
        //.allowEager('[video, user, jobpost, jobpost.question]')
        .eager('[video, user, jobpost.question]')
        .where('jobpost_id', jobpost_id)
        .then((result) => { cb(null, result) })
        .catch((err) => { cb(err, null); });
    },
    updateSubmission: (id, body, cb) => {
      Submission
        .query()
        .update(body)
        .where('id', id)
        .skipUndefined()
        .then((result) => { cb(null, result) })
        .catch( err => { console.log(err) })
    }
  },
  videos: {
    createOne: (body, cb) => {
      Video
        .query()
        .insertAndFetch(body)
        .then((video) => { cb(null, video); })
        .catch((err) => { console.log(err); });
    }
  },

  questions: {
    getAll: (cb) => {
      Question
        .query()
        .then((questions) => { cb(null, questions); })
        .catch((err) => { cb(err, null); });
    }
  },

  locations: {
    getAll: (cb) => {
      Location
        .query()
        .then((location) => { cb(null, location); })
        .catch((err) => { cb(err, null); });
    }
  },

  industries: {
    getAll: (cb) => {
      Industry
        .query()
        .then((industry) => { cb(null, industry); })
        .catch((err) => { cb(err, null); });
    }
  },

  dashboard: {
    getAllStats: async (companyId, cb) => {
      const stats = {};

      const jobpostCount = await Jobpost
        .query()
        .where('company_id', companyId)
        .count('id')
        .catch((e) => { return cb(e, null); });
      stats.jobpost = jobpostCount;

      const submissionCount = await Submission
        .query()
        .count('id')
        .catch((e) => { return cb(e, null); });
      stats.submission = submissionCount;

      const userCount = await User
        .query()
        .count('id')
        .catch((e) => { return cb(e, null); });
      stats.user = userCount;

      cb(null, stats);
    }
  }
};

