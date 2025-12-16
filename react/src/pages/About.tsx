import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ravelSilhouette from "../assets/ravel-silhouette.png";

const About: React.FC = () => {
  return (
    <Box
      sx={{ minHeight: "100vh", backgroundColor: "#1E1E1E", color: "#F8E3B6" }}
    >
      <Box
        sx={{
          position: "relative",
          py: { xs: 8, md: 12 },
          backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.85), rgba(0,0,0,0.55)), url(${ravelSilhouette})`,
          backgroundSize: "cover",
          backgroundPosition: "right center",
          borderBottom: "1px solid rgba(229,176,94,0.25)",
        }}
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h2"
              fontWeight="bold"
              sx={{
                color: "#E5B05E",
                textShadow: "2px 2px 10px rgba(0,0,0,0.7)",
              }}
            >
              À propos
            </Typography>

            <Typography sx={{ mt: 2, maxWidth: 820, lineHeight: 1.7 }}>
              Cette initiative est née d’un besoin simple : rendre accessible au
              plus grand nombre l’héritage de Maurice Ravel — partitions,
              enregistrements de référence, et repères clairs pour suivre
              l’actualité musicale autour de son œuvre.
            </Typography>

            <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                component={Link}
                to="/shop"
                variant="contained"
                sx={{
                  backgroundColor: "#490D2D",
                  "&:hover": { backgroundColor: "#7D173F" },
                }}
              >
                Explorer la boutique
              </Button>
              <Button
                component={Link}
                to="/events"
                variant="outlined"
                sx={{
                  borderColor: "rgba(229,176,94,0.6)",
                  color: "#E5B05E",
                  "&:hover": { borderColor: "#E5B05E" },
                }}
              >
                Voir les concerts & événements
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* CONTENT */}
      <Container sx={{ py: { xs: 6, md: 8 } }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" fontWeight="bold" sx={{ color: "#E5B05E" }}>
            Notre mission
          </Typography>
          <Typography sx={{ mt: 2, lineHeight: 1.8 }}>
            Proposer une expérience “premium” : une sélection soignée, une
            présentation élégante, et des contenus fiables — pour découvrir,
            approfondir et transmettre l’univers de Ravel.
          </Typography>

          <Divider sx={{ my: 5, borderColor: "rgba(229,176,94,0.18)" }} />

          <Grid container spacing={3}>
            {[
              {
                title: "Partitions & ressources",
                text: "Accéder à des partitions, références et documents utiles pour interprètes, étudiants et passionnés.",
              },
              {
                title: "Enregistrements remarquables",
                text: "Mettre en valeur des lectures d’exception et des musiciens qui ont façonné la réception de Ravel.",
              },
              {
                title: "Agenda culturel",
                text: "Informer sur les concerts, conférences, expositions et événements liés à Ravel et à son époque.",
              },
            ].map((item) => (
              <Grid item xs={12} md={4} key={item.title}>
                <Card
                  sx={{
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.45)",
                    border: "1px solid rgba(229,176,94,0.18)",
                    borderRadius: "16px",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ color: "#E5B05E" }}
                    >
                      {item.title}
                    </Typography>
                    <Typography sx={{ mt: 1.5, lineHeight: 1.7 }}>
                      {item.text}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 5, borderColor: "rgba(229,176,94,0.18)" }} />

          <Typography variant="h4" fontWeight="bold" sx={{ color: "#E5B05E" }}>
            Maurice Ravel en bref
          </Typography>

          <Box sx={{ mt: 2, display: "grid", gap: 1.5, maxWidth: 980 }}>
            <Typography sx={{ lineHeight: 1.8 }}>
              • Né en 1875 et mort en 1937, Maurice Ravel est l’un des
              compositeurs français majeurs du début du XXe siècle.
            </Typography>
            <Typography sx={{ lineHeight: 1.8 }}>
              • Son catalogue allie raffinement orchestral et précision
              d’écriture — de <i>Daphnis et Chloé</i> à <i>La Valse</i>, en
              passant par le <i>Concerto pour piano en sol</i>.
            </Typography>
            <Typography sx={{ lineHeight: 1.8 }}>
              • Pendant la Première Guerre mondiale, il a servi comme conducteur
              dans un corps de transport motorisé.
            </Typography>
            <Typography sx={{ lineHeight: 1.8 }}>
              • <i>Boléro</i> (1928) reste l’une de ses œuvres les plus célèbres
              — un “crescendo” orchestral devenu iconique.
            </Typography>
          </Box>

          <Box
            sx={{
              mt: 5,
              p: 3,
              borderRadius: "16px",
              border: "1px solid rgba(229,176,94,0.18)",
              background: "rgba(0,0,0,0.35)",
            }}
          >
            <Typography sx={{ lineHeight: 1.8 }}>
              Notre objectif n’est pas seulement de vendre : c’est de
              transmettre un héritage, de guider la découverte, et de créer un
              point de repère élégant pour tous ceux qui aiment Ravel.
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default About;
