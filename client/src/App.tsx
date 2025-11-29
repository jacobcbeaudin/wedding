import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CoastalLayout from "@/components/CoastalLayout";
import Navigation from "@/components/Navigation";
import PasswordProtection from "@/components/PasswordProtection";
import Home from "@/pages/Home";
import OurStory from "@/pages/OurStory";
import Events from "@/pages/Events";
import Venue from "@/pages/Venue";
import RSVP from "@/pages/RSVP";
import Registry from "@/pages/Registry";
import Photos from "@/pages/Photos";
import FAQ from "@/pages/FAQ";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/story" component={OurStory} />
      <Route path="/events" component={Events} />
      <Route path="/venue" component={Venue} />
      <Route path="/rsvp" component={RSVP} />
      <Route path="/registry" component={Registry} />
      <Route path="/photos" component={Photos} />
      <Route path="/faq" component={FAQ} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PasswordProtection>
          <CoastalLayout>
            <Navigation />
            <Router />
          </CoastalLayout>
        </PasswordProtection>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
