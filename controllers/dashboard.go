package controllers

import (
	"github.com/mouselog/mouselog/util"

	"github.com/mouselog/mouselog/trace"
)

var ssm2 map[string]*trace.Session

func init() {
	ssm2 = map[string]*trace.Session{}
}

func getOrCreateSs2(fileId string) *trace.Session {
	var ss *trace.Session

	if _, ok := ssm[fileId]; ok {
		ss = ssm[fileId]
	} else {
		ss = trace.ReadTraces(fileId)
		ssm[fileId] = ss

		//ss.SyncGuesses()
	}

	return ss
}

func listTraceFiles(path string) []*trace.Session {
	res := []*trace.Session{}

	for _, fileId := range util.ListFileIds(path) {
		getOrCreateSs2(fileId)
	}

	m := map[string]interface{}{}
	for k, v := range ssm {
		m[k] = v
	}
	kv := util.SortMapsByKey(&m)
	for _, v := range *kv {
		res = append(res, v.Key.(*trace.Session))
	}

	return res
}

func (c *ApiController) ListSessions() {
	sss := listTraceFiles(util.CacheDir + "mouselog/")
	res := []*trace.SessionJson{}
	for _, ss := range sss {
		res = append(res, ss.ToJson())
	}

	c.Data["json"] = res
	c.ServeJSON()
}

func (c *ApiController) ListTraces() {
	fileId := c.Input().Get("fileId")
	perPage := util.ParseInt(c.Input().Get("perPage"))
	page := util.ParseInt(c.Input().Get("page"))
	ss := getOrCreateSs2(fileId)

	last := perPage * (page + 1)
	if last > len(ss.Data) {
		last = len(ss.Data)
	}
	table := ss.Data[(perPage * page):last]

	c.Data["json"] = map[string]interface{} {
		"data": table,
		"page": page,
		"total": len(ss.Data),
	}
	c.ServeJSON()
}