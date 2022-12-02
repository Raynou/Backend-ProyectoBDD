import { Router } from "express";
import fetch from "node-fetch";

const router = Router();
var session;

router.get("/", function (req, res) {
  res.render("index.html", {
    current_page: "Proyecto VEX",
    message: req.flash("info"),
    messagetype: req.flash("type"),
  });
});

router.get("/about", function (req, res) {
  res.render("about.html", {
    current_page: "Conocenos",
    message: req.flash("info"),
    messagetype: req.flash("type"),
  });
});

router.get("/events", function (req, res) {
  fetch("http://localhost:3000/query/events", { method: "GET" })
    .then((res) => res.json())
    .then((json) => {
      res.render("events.html", {
        current_page: "Eventos",
        events: json,
        message: req.flash("info"),
        messagetype: req.flash("type"),
      });
    });
});

router.get("/dashboard", function (req, res) {
  session = req.session;

  console.log(session);

  if (session.userid == "cordi") {
    res.redirect("/dashboard/coordinador");
  } else if (session.userid) {
    res.redirect("/dashboard/jurado");
  } else {
    res.redirect("/dashboard/login");
  }
});

router.get("/dashboard/login", function (req, res) {
  res.render("dashboard/login.html", {
    current_page: "Login",
    message: req.flash("info"),
    messagetype: req.flash("type"),
  });
});

router.get("/dashboard/coordinador", function (req, res) {
  res.render("dashboard/dashboard_view.html", {
    current_page: "Dashboard Coordinador",
    message: req.flash("info"),
    messagetype: req.flash("type"),
  });
});

router.get("/dashboard/coordinador/registro_equipo", function (req, res) {
  fetch("http://localhost:3000/query/events", { method: "GET" })
    .then((res) => res.json())
    .then((json) => {
      res.render("dashboard/registro_equipo.html", {
        current_page: "Dashboard Coordinador",
        events: json,
        message: req.flash("info"),
        messagetype: req.flash("type"),
      });
    });
});

router.get("/dashboard/jurado", function (req, res) {
  res.render("dashboard/dashboard_view.html", {
    current_page: "Dashboard Jurado",
  });
});

router.get("/dashboard/coordinador/modificar_equipo", async function (req, res) {
  const response = await fetch("http://localhost:3000/query/get_all_teams", {
    method: "GET",
  });
  const json = await response.json();
  res.render("dashboard/modificar_equipo.html", {
    current_page: "Dashboard Coordinador",
    equipos: json,
    message: req.flash("info"),
    messagetype: req.flash("type"),
  });
});

router.post("/dashboard/coordinador/modificar_equipo", async function (req, res) {
  const responsee = await fetch("http://localhost:3000/query/get_all_teams", {
    method: "GET",
  });
  const json = await responsee.json();

  const rel = await fetch(
    "http://localhost:3000/query/get_team_by_id?id=" + req.body.equipo,
    { method: "GET" }
  );
  const rep = await rel.json();
  
  const response = await fetch(
    "http://localhost:3000/query/get_part_of_team?id=" + req.body.equipo,
    { method: "GET" }
  );
  const data = await response.json();

  res.render("dashboard/modificar_equipo.html", {
    current_page: "Dashboard Coordinador",
    events: json,
    equipo: rep,
    datos_equipo: data,
    message: req.flash("info"),
    messagetype: req.flash("type"),
  });
});

router.get("/dashboard/coordinador/registro_jurado", function (req, res) {
  res.render("dashboard/registro_jurado.html", {
    current_page: "Dashboard Coordinador",
    message: req.flash("info"),
    messagetype: req.flash("type"),
  });
});

router.get("/dashboard/coordinador/asignar_jurado", async function (req, res) {
  const response = await fetch("http://localhost:3000/query/judge_event", {
    method: "GET",
  });
  const data = await response.json();

  res.render("dashboard/asignar_jurado.html", {
    current_page: "Dashboard Coordinador",
    data: data,
    message: req.flash("info"),
    messagetype: req.flash("type"),
  });
});

router.get("/dashboard/coordinador/asignar_equipo", async function (req, res) {
  const response = await fetch("http://localhost:3000/query/team_event", {
    method: "GET",
  });
  const data = await response.json();

  res.render("dashboard/asignar_equipo.html", {
    current_page: "Dashboard Coordinador",
    data: data,
    message: req.flash("info"),
    messagetype: req.flash("type"),
  });
});

router.get("/dashboard/coordinador/registro_evento", function (req, res) {
  res.render("dashboard/registro_evento.html", {
    current_page: "Dashboard Coordinador",
    message: req.flash("info"),
    messagetype: req.flash("type"),
  });
});

router.get("/dashboard/coordinador/modificar_evento", function (req, res) {
  fetch("http://localhost:3000/query/events", { method: "GET" })
    .then((res) => res.json())
    .then((json) => {
      res.render("dashboard/modificar_evento.html", {
        current_page: "Dashboard Coordinador",
        events: json,
        message: req.flash("info"),
        messagetype: req.flash("type"),
      });
    });
});

router.get('/dashboard/coordinador/modificar_jurado', async function(req, res) {
    const response = await fetch("http://localhost:3000/query/judge", { method: "GET" })
    const json = await response.json()
    res.render('dashboard/modificar_jurado.html', {current_page: "Dashboard Coordinador", judges: json, message: req.flash("info"), messagetype: req.flash("type")});
});

router.post('/dashboard/coordinador/modificar_jurado', async function(req, res) {
    const response = await fetch("http://localhost:3000/query/judge", { method: "GET" })
    const json = await response.json()


    console.log(req.body.evento)
    const responsee = await fetch("http://localhost:3000/query/judgeById?id="+req.body.evento, { method: "GET" })
    const jsone = await responsee.json()
    console.log(jsone)
    res.render('dashboard/modificar_jurado.html', {current_page: "Dashboard Coordinador", judges: json, datos_jurado: jsone, message: req.flash("info"), messagetype: req.flash("type")});
})
router.post("/dashboard/coordinador/modificar_evento", async function (req, res) {
  const getEvents = await fetch(
    "http://localhost:3000/query/events",
    { method: "GET" }
  );
  const events = await getEvents.json()

  const rel = await fetch(
    "http://localhost:3000/query/get_event_by_id?id=" + req.body.evento,
    { method: "GET" }
  );
  const data = await rel.json();

  console.log(data);

  res.render("dashboard/modificar_evento.html", {
    current_page: "Dashboard Coordinador",
    events: events,
    datos_evento: data,
    message: req.flash("info"),
    messagetype: req.flash("type"),
  });
});

/*
router.post("/dashboard/coordinador/modificar_equipo", async function (req, res) {
  const responsee = await fetch("http://localhost:3000/query/get_all_teams", {
    method: "GET",
  });
  const json = await responsee.json();

  const rel = await fetch(
    "http://localhost:3000/query/get_team_by_id?id=" + req.body.equipo,
    { method: "GET" }
  );
  const rep = await rel.json();
  
  const response = await fetch(
    "http://localhost:3000/query/get_part_of_team?id=" + req.body.equipo,
    { method: "GET" }
  );
  const data = await response.json();

  res.render("dashboard/modificar_equipo.html", {
    current_page: "Dashboard Coordinador",
    events: json,
    equipo: rep,
    datos_equipo: data,
    message: req.flash("info"),
    messagetype: req.flash("type"),
  });
}); */

router.get("/dashboard/coordinador/modificar_jurado", function (req, res) {
  fetch("http://localhost:3000/query/judge", { method: "GET" })
    .then((res) => res.json())
    .then((json) => {
      res.render("dashboard/modificar_jurado.html", {
        current_page: "Dashboard Coordinador",
        judges: json,
        message: req.flash("info"),
        messagetype: req.flash("type"),
      });
    });
});

router.get("/dashboard/jurado", function (req, res) {
  res.render("dashboard/dashboard_view.html", {
    current_page: "Dashboard Jurado",
    message: req.flash("info"),
    messagetype: req.flash("type")
  });
});

router.get("/dashboard/jurado/evaluar_equipo", async function (req, res) {
  session = req.session;
  console.log(session);

  const rel = await fetch("http://localhost:3000/query/get_jury_cat_teams?userid=" + session.userid, { method: "GET" })
    const result = await rel.json();

      const conv = function (text) {
        return text.replaceAll(" ", "-");
      };

      const inv_conv = function (text) {
        return text.replaceAll("-", " ");
      };
      var dict = [];

      for (var i = 0; i < result.length; i++) {
        var obj = result[i];

        if (dict[obj.nombre_evento]) {
          dict[obj.nombre_evento].push(obj.cod_proyecto);
        } else {
          dict[obj.nombre_evento] = [obj.cod_proyecto];
        }
      }

      var events = [];

      for (var i = 0; i < result.length; i++) {
        var obj = result[i];
        result[i].nombre_evento = conv(result[i].nombre_evento);
        obj.nombre_evento = conv(obj.nombre_evento);

        if (!events.includes(obj.nombre_evento)) {
          events.push(obj.nombre_evento);
        }
      }

      var jton = JSON.stringify(dict);

      console.log(dict);
      console.log(events);
      console.log(result);
      res.render("dashboard/evaluar_equipo.html", {
        current_page: "Dashboard Jurado",
        events: events,
        data: result,
        conv: inv_conv,
        message: req.flash("info"),
        messagetype: req.flash("type"),
      });
});

router.get("/dashboard/publico", function (req, res) {
  res.render("dashboard/dashboard_view.html", {
    current_page: "Dashboard Publico",
    message: req.flash("info"),
    messagetype: req.flash("type"),
  });
});

router.get("/dashboard/publico/ver_resultados", async function (req, res) {
  const events_response = await fetch("http://localhost:3000/query/events", {
    method: "GET",
  });
  const events_data = await events_response.json();

  res.render("dashboard/ver_resultados.html", {
    current_page: "Dashboard Publico",
    events: events_data,
    message: req.flash("info"),
    messagetype: req.flash("type"),
  });
});

router.post("/dashboard/publico/ver_resultados", async function (req, res) {
  const events_response = await fetch("http://localhost:3000/query/events", {
    method: "GET",
  });
  const events_data = await events_response.json();

    if (!req.body.evento || !req.body.categoria_evento ) {
  res.render("dashboard/ver_resultados.html", {
    current_page: "Dashboard Publico",
    events: events_data,
    message: req.flash("info"),
    messagetype: req.flash("type"),
  });
	return
    }

  const evals_response = await fetch(
    "http://localhost:3000/query/evaluations?evento=" +
      req.body.evento +
      "&categoria_evento=" +
      req.body.categoria_evento,
    { method: "GET" }
  );
  const evals_data = await evals_response.json();

  console.log(evals_data);

  res.render("dashboard/ver_resultados.html", {
    current_page: "Dashboard Publico",
    events: events_data,
    evaluations: evals_data,
    message: req.flash("info"),
    messagetype: req.flash("type"),
  });
});

router.get("/dashboard/logout", function (req, res) {
  req.flash("info", "Sesión cerrada");
  req.flash("type", "info");
  delete req.session.userid;
  res.redirect("/");
});

export default router;
