var should = require('chai').should()
  , assert = require('chai').assert
  , testDb = 'workspace/test3.db'
  , fs = require('fs')
  , path = require('path')
  , _ = require('lodash')
  , async = require('async')
  , rimraf = require('rimraf')
  , Model = require('../lib/model')
  , Cursor = require('../lib/cursor')
  ;


describe('Schema', function () {
  var d;

  beforeEach(function (done) {
    async.waterfall([
     function (cb) {
      if (! d) return cb();
      d.store.close(cb);
     },
     function (cb) {
        rimraf(testDb, cb);
     },
     function (cb) {
        d = new Model("testDb", { filename: testDb });
        d.filename.should.equal(testDb);

        d.reload(function (err) {
          assert.isNull(err);
          d.getAllData().length.should.equal(0);
          return cb();
        });
      }
    ], done);
  });

  describe('Indexing', function() {
    // TODO: also check dot notation for indexes on this test
    beforeEach(function (done) {
      d = new Model("testDb", { 
        name: { index: true, unique: true, sparse: true },
        age: { index: true },
        department: { index: false }
      }, { filename: testDb });

      d.insert([
        { age: 27, name: "Kelly", department: "support" },
        { age: 31, name: "Jim", department: "sales" },
        { age: 33, name: "Dwight", department: "sales" }, 
        { age: 45, name: "Michael", department: "management" },
        { age: 46, name: "Toby", department: "hr" },
        { age: 45, name: "Phyllis", department: "sales" },
        { age: 23, name: "Ryan", department: "sales" },

      ], function (err) {
        done();
      });
    });

    it("Create indexes specified in schema, auto-indexing does not override them", function(done) {
      assert.isDefined(d.indexes.name);
      assert.isDefined(d.indexes.age);
      assert.isUndefined(d.indexes.department);

      d.indexes.name.sparse.should.equal(true);
      d.indexes.name.unique.should.equal(true);

      d.find({ name: "Dwight" }, function(err, docs) {
        assert.isNull(err);

        docs.length.should.equal(1);
        docs[0].name.should.equal("Dwight");

        d.indexes.name.sparse.should.equal(true);
        d.indexes.name.unique.should.equal(true);

        done();
      });

      done();
    });

  });


  describe('Validation', function() {
    it("basic type validation", function(done) {
      done(new Error("not implemented"))
    });

    it("strict validation - remove other keys", function(done) {
      done(new Error("not implemented"))
    });

  });
    

});


