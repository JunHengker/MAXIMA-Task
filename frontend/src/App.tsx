import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Stack, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

function App() {
  const [catFact, setCatFact] = useState("");
  const [nunggu, setNunggu] = useState(true);

  const fetchFact = async () => {
    try {
      setNunggu(true);
      const response = await axios.get("https://catfact.ninja/fact");
      const data = response.data;
      setCatFact(data.fact);
      setNunggu(false);
    } catch (error) {
      console.error("Error fetching random cat fact:", error);
    }
  };

  const handleFact = () => {
    setNunggu(true);
    fetchFact();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFact();
    });

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Stack
        position={"absolute"}
        top={0}
        left={0}
        width={"100%"}
        height={"100vh"}
        backgroundPosition={"center"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        bgColor={"black.200"}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            padding: "20px",
          }}
        >
          <Stack
            alignItems={"center"}
            justifyContent={"center"}
            padding={"2em"}
            backgroundColor={"white"}
            borderRadius={"8px"}
            width={["10em, 15em, 20em, 50em, 50em"]}
            height={["19em, 17em, 15em, 12em, 12em"]}
          >
            {nunggu ? (
              <Text fontSize="xl" color="red">
                Sebentar...
              </Text>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Text
                  fontSize={"xl"}
                  color={"black"}
                  textAlign={"center"}
                  fontWeight={"bold"}
                >
                  {catFact}
                </Text>
              </motion.div>
            )}
            <Button colorScheme="blue" onClick={handleFact}>
              New Fact
            </Button>
          </Stack>
        </motion.div>
      </Stack>
    </>
  );
}

export default App;
