﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Nikolai.Controllers
{
    public class WorkController : BaseController
    {
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult WorkPartial()
        {
            return PartialView("_workTiles");
        }

        [HttpGet]
        public ActionResult Multiplex()
        {
            return View();
        }

        [HttpGet]
        public ActionResult MultiplexPartial()
        {
            return PartialView("_multiplex");
        }

        [HttpGet]
        public ActionResult Boxgrove()
        {
            return View();
        }

        [HttpGet]
        public ActionResult BoxgrovePartial()
        {
            return PartialView("_boxgrove");
        }

        [HttpGet]
        public ActionResult RateQuote()
        {
            return View();
        }

        [HttpGet]
        public ActionResult RateQuotePartial()
        {
            return PartialView("_rateQuote");
        }

        [HttpGet]
        public ActionResult HR()
        {
            return View();
        }

        [HttpGet]
        public ActionResult HRPartial()
        {
            return PartialView("_hr");
        }

        [HttpGet]
        public ActionResult TopNav()
        {
            return View();
        }

        [HttpGet]
        public ActionResult TopNavPartial()
        {
            return PartialView("_topnav");
        }

        [HttpGet]
        public ActionResult Dashboard()
        {
            return View();
        }

        [HttpGet]
        public ActionResult DashboardPartial()
        {
            return PartialView("_dashboard");
        }
    }
}