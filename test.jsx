const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await deliveryLogin(credentials);
    setLoading(false);
  
    if (success) {
      navigate("/delivery");
    } else {
      setError("Invalid username or password");
    }
  };
  

